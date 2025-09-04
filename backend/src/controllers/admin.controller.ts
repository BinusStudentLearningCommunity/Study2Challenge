import { Request, Response } from "express";
import Team from "../models/team.model";
import Member from "../models/member.model";
import mongoose from "mongoose";

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Get semua tim beserta member-membernya
export const getAllTeams = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const teams = await Team.find();

    // Ambil member untuk setiap tim
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await Member.find({ teamId: team._id });
        return {
          ...team.toObject(),
          members,
        };
      })
    );

    res.status(200).json(teamsWithMembers);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data tim", error });
  }
};

// Update status tim (isPay, isQualified)
export const updateTeamStatus = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const { teamId } = req.params;
    const { isPay, isQualified } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      res.status(400).json({ message: "Invalid team ID" });
      return;
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      { $set: { isPay, isQualified } },
      { new: true }
    );

    if (!updatedTeam) {
      res.status(404).json({ message: "Tim tidak ditemukan" });
      return;
    }

    res.status(200).json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: "Gagal update status tim", error });
  }
};

// Get detail satu tim beserta membernya
export const getTeamDetail = async (
  req: RequestWithUser,
  res: Response
): Promise<void> => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      res.status(400).json({ message: "Invalid team ID" });
      return;
    }

    const team = await Team.findById(teamId);
    if (!team) {
      res.status(404).json({ message: "Tim tidak ditemukan" });
      return;
    }

    const members = await Member.find({ teamId });

    res.status(200).json({
      ...team.toObject(),
      members,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail tim", error });
  }
};
