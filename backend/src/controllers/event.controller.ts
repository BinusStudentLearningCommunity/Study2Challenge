import { Request, Response } from "express";
import Member from "../models/member.model";
import Team from "../models/team.model";
import TeamMembership from "../models/team.membership.model";
import mongoose from "mongoose";
import User from "../models/user.model";

const generateUniqueTeamCode = async (): Promise<string> => {
  let teamCode: string = "";
  let isExisting = true;

  while (isExisting) {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    teamCode = randomNumber.toString();

    const existingTeam = await Team.findOne({ teamCode });

    if (!existingTeam) {
      isExisting = false;
    }
  }
  return teamCode;
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    if (!req.files) {
      return res.status(400).json({
        message: "No files uploaded",
        debug: { hasFiles: !!req.files },
      });
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Validate required files
    if (!files["creatorIdCard"]?.[0]) {
      return res.status(400).json({
        message: "Creator ID Card is required",
        debug: { availableFiles: Object.keys(files) },
      });
    }

    if (!files["paymentProof"]?.[0]) {
      return res.status(400).json({
        message: "Payment proof is required",
        debug: { availableFiles: Object.keys(files) },
      });
    }

    const creatorIdCardFile = files["creatorIdCard"][0];
    const memberIdCardFiles = files["memberIdCards"] || [];
    const paymentProofFile = files["paymentProof"][0];

    const { teamName, creatorDetails, teamMembers } = req.body;

    // Validate required fields
    if (!teamName || !creatorDetails || !teamMembers) {
      return res.status(400).json({
        message: "Missing required fields",
        debug: {
          hasTeamName: !!teamName,
          hasCreatorDetails: !!creatorDetails,
          hasTeamMembers: !!teamMembers,
        },
      });
    }

    let parsedCreatorDetails;
    let parsedTeamMembers;

    try {
      parsedCreatorDetails = JSON.parse(creatorDetails);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid creator details format",
        debug: { creatorDetails, error: (error as Error).message },
      });
    }

    try {
      parsedTeamMembers = JSON.parse(teamMembers);
    } catch (error) {
      return res.status(400).json({
        message: "Invalid team members format",
        debug: { teamMembers, error: (error as Error).message },
      });
    }

    const creator = await User.findById(req.user!.userId);

    if (!creator) {
      return res.status(404).json({ message: "Creator user not found." });
    }

    const existingCreatorMembership = await TeamMembership.findOne({
      userId: creator._id,
    });
    if (existingCreatorMembership) {
      return res.status(409).json({ message: "You are already in a team." });
    }

    const newTeamCode = await generateUniqueTeamCode();
    const newTeam = new Team({
      teamName,
      teamCode: newTeamCode,
      paymentProofUrl: paymentProofFile?.path,
      isQualified: true,
    });
    await newTeam.save();

    const creatorMembership = new TeamMembership({
      teamId: newTeam._id,
      userId: creator._id,
    });
    await creatorMembership.save();

    const creatorMember = new Member({
      teamId: newTeam._id,
      // Use the PARSED object
      email: parsedCreatorDetails.email,
      fullName: parsedCreatorDetails.fullName,
      dateOfBirth: parsedCreatorDetails.dateOfBirth,
      gender: parsedCreatorDetails.gender,
      whatsappNumber: parsedCreatorDetails.whatsappNumber,
      institution: parsedCreatorDetails.institution,
      idCardUrl: creatorIdCardFile?.path,
      twibbonLink: parsedCreatorDetails.twibbonLink,
      role: "LEADER",
    });

    const otherMembersToInsert = parsedTeamMembers.map(
      (memberData: any, index: number) => ({
        teamId: newTeam._id,
        email: memberData.email,
        fullName: memberData.fullName,
        dateOfBirth: memberData.dateOfBirth,
        gender: memberData.gender,
        whatsappNumber: memberData.whatsappNumber,
        institution: memberData.institution,
        idCardUrl: memberIdCardFiles[index]?.path,
        twibbonLink: memberData.twibbonLink,
        role: "MEMBER",
      })
    );

    await Member.insertMany([creatorMember, ...otherMembersToInsert]);

    res.status(201).json({
      message: "Team registered successfully!",
      teamCode: newTeam.teamCode,
    });
  } catch (error: any) {
    console.error("Registration Error:", {
      errorMessage: error.message,
      errorStack: error.stack,
      requestBody: req.body,
      files: req.files,
    });

    // Return more specific error messages based on error type
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).json({
        message: "Validation error",
        details: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      // MongoDB duplicate key error
      return res.status(409).json({
        message: "Team name or email already exists",
        debug: error.keyPattern,
      });
    }

    res.status(500).json({
      message: "Failed to register team",
      error: error.message,
      type: error.name,
      path: error.path,
    });
  }
};

export const joinTeam = async (req: Request, res: Response) => {
  try {
    const { teamCode } = req.body;
    const user = await User.findById(req.user!.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: "Team code not found." });
    }

    const existingMembership = await TeamMembership.findOne({
      userId: user._id,
    });
    if (existingMembership) {
      return res
        .status(409)
        .json({ message: "You are already in another team." });
    }

    const membershipCount = await TeamMembership.countDocuments({
      teamId: team._id,
    });
    if (team.isLock || membershipCount >= 3) {
      // Use 409 Conflict to indicate the team is full, which won't trigger a logout.
      return res.status(409).json({
        message: "This team is already full and cannot accept new members.",
      });
    }

    const newMembership = new TeamMembership({
      teamId: team._id,
      userId: user._id,
    });
    await newMembership.save();

    if (membershipCount + 1 >= 3) {
      await Team.updateOne({ _id: team._id }, { $set: { isLock: true } });
    }

    res.status(200).json({
      message: "Successfully joined the team",
      teamName: team.teamName,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Failed to join team", error: error.message });
  }
};

export const getMyTeam = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const membership = await TeamMembership.findOne({ userId });
    if (!membership) {
      return res
        .status(404)
        .json({ message: "Kamu belum tergabung dalam tim manapun." });
    }

    const team = await Team.findById(membership.teamId);
    if (!team) {
      return res.status(404).json({ message: "Data tim tidak ditemukan." });
    }

    const members = await Member.find({ teamId: team._id });

    res.status(200).json({
      team,
      members,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data tim", error: error.message });
  }
};
