import { Request, Response } from "express";
import mongoose from "mongoose";
import Team from "../models/team.model";
import Member from "../models/member.model";
import TeamMembership from "../models/team.membership.model";

export const getMyTeam = async (req: Request, res: Response) => {
  try {
    // Get the user's ID from the authenticated session
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in token" });
    }

    console.log("Looking for team membership with userId:", userId);

    // Find team membership for the user
    const membership = await TeamMembership.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (!membership) {
      return res
        .status(404)
        .json({ message: "You haven't joined any team yet" });
    }

    console.log("Found membership:", membership);

    // Get the team details
    const team = await Team.findById(membership.teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    // Find members associated with this team
    const members = await Member.find({ teamId: team._id }).select(
      "-password -__v"
    );

    // Combine team data with members
    const teamData = {
      ...team.toObject(),
      members: members,
    };

    console.log("Sending team data:", teamData);
    res.json(teamData);
  } catch (error: any) {
    console.error("Error in getMyTeam:", error);
    res.status(500).json({
      message: "Server error while fetching team data",
      error: error.message || "Unknown error",
    });
  }
};
