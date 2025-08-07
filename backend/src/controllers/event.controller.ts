import { Request, Response } from "express";
import Member from "../models/member.model";
import Team from "../models/team.model";
import TeamMembership from "../models/team.membership.model";
import mongoose from "mongoose";
import User from "../models/user.model";


const generateUniqueTeamCode = async (): Promise<string> => {
    let teamCode: string = '';
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
        const { teamName, paymentProofUrl, creatorDetails, teamMembers } = req.body;
        const creator = await User.findById(req.user!.userId);

        if (!creator) {
            return res.status(404).json({ message: 'Creator user not found.' });
        }

        const existingCreatorMembership = await TeamMembership.findOne({ userId: creator._id });
        if (existingCreatorMembership) {
            return res.status(409).json({ message: 'You are already in a team.' });
        }

        const newTeamCode = await generateUniqueTeamCode();
        const newTeam = new Team({ teamName, teamCode: newTeamCode, paymentProofUrl, isQualified: true });
        await newTeam.save();

        const creatorMembership = new TeamMembership({ teamId: newTeam._id, userId: creator._id });
        await creatorMembership.save();

        const creatorMember = new Member({
            teamId: newTeam._id,
            email: creatorDetails.email,
            fullName: creatorDetails.fullName,
            dateOfBirth: creatorDetails.dateOfBirth,
            gender: creatorDetails.gender,
            whatsappNumber: creatorDetails.whatsappNumber,
            institution: creatorDetails.institution,
            idCardUrl: creatorDetails.idCardUrl,
            twibbonLink: creatorDetails.twibbonLink,
            role: 'LEADER'
        });

        const otherMembersToInsert = teamMembers.map((memberData: any) => ({
            teamId: newTeam._id,
            email: memberData.email, // Email is now for info only
            fullName: memberData.fullName,
            dateOfBirth: memberData.dateOfBirth,
            gender: memberData.gender,
            whatsappNumber: memberData.whatsappNumber,
            institution: memberData.institution,
            idCardUrl: memberData.idCardUrl,
            twibbonLink: memberData.twibbonLink,
            role: 'MEMBER'
        }));

        await Member.insertMany([creatorMember, ...otherMembersToInsert]);

        res.status(201).json({
            message: 'Team registered successfully!',
            teamCode: newTeam.teamCode
        });

    } catch (error: any) {
        res.status(500).json({ message: 'Failed to register team', error: error.message });
    }
};


export const joinTeam = async (req: Request, res: Response) => {
    try {
        const { teamCode } = req.body;
        const user = await User.findById(req.user!.userId);

        if (!user) { return res.status(404).json({ message: 'User not found.' }); }

        const team = await Team.findOne({ teamCode });
        if (!team) { return res.status(404).json({ message: 'Team code not found.' }); }


        const existingMembership = await TeamMembership.findOne({ userId: user._id });
        if (existingMembership) { return res.status(409).json({ message: 'You are already in another team.' }); }
        
        const membershipCount = await TeamMembership.countDocuments({ teamId: team._id });
        if (team.isLock || membershipCount >= 3) {
            // Use 409 Conflict to indicate the team is full, which won't trigger a logout.
            return res.status(409).json({ message: 'This team is already full and cannot accept new members.' });
        }


        const newMembership = new TeamMembership({ teamId: team._id, userId: user._id });
        await newMembership.save();

        if (membershipCount + 1 >= 3) {
            await Team.updateOne({ _id: team._id }, { $set: { isLock: true } });
        }

        res.status(200).json({ message: 'Successfully joined the team', teamName: team.teamName });

    } catch (error: any) {
        res.status(500).json({ message: 'Failed to join team', error: error.message });
    }
};

export const getMyTeam = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        const membership = await TeamMembership.findOne({ userId });
        if (!membership) {
            return res.status(404).json({ message: 'Kamu belum tergabung dalam tim manapun.' });
        }

        const team = await Team.findById(membership.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Data tim tidak ditemukan.' });
        }

        const members = await Member.find({ teamId: team._id });

        res.status(200).json({
            team,
            members
        });
    } catch (error: any) {
        res.status(500).json({ message: 'Gagal mengambil data tim', error: error.message });
    }
};
