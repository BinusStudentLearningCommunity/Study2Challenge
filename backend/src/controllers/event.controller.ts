import { Request, Response } from "express";
import Member from "../models/member.model";
import Team from "../models/team.model";
import TeamMembership from "../models/team.membership.model";
import mongoose from "mongoose";
import User from "../models/user.model";

// generate code
const generateUniqueTeamCode = async (): Promise<string> => {
    let teamCode: string = '';
    let isExsits = false;

    while (!isExsits) {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        teamCode = randomNumber.toString();
        
        const existingTeam = await Team.findOne({ teamCode });
        
        if (!existingTeam) {
            isExsits = true;
        }
    }
    return teamCode;
};

export const registerForEvent = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { teamName, paymentProofUrl, teamMembers } = req.body;
        const userId = req.user?.userId;
        const userEmail = req.user?.email;

        const existingMembership = await TeamMembership.findOne({ userId }).session(session);
        if (existingMembership) {
            await session.abortTransaction();
            return res.status(409).json({ message: 'User sudah terdaftar di tim lain' });
        }

        const newTeamCode = await generateUniqueTeamCode();

        const newTeam = new Team({
            teamCode: newTeamCode,
            teamName,
            paymentProofUrl,
            isPay: false,
            isLock: false,
            isQualified: false,
            email: userEmail
        });
        await newTeam.save({ session });

        const teamMembership = new TeamMembership({
            teamId: newTeam._id,
            userId: userId
        });
        await teamMembership.save({ session });

        const membersToInsert = teamMembers.map((member: any) => ({
            ...member,
            teamId: newTeam._id
        }));
        await Member.insertMany(membersToInsert, { session });

        await session.commitTransaction();
        res.status(201).json({ 
            message: 'Berhasil mendaftar untuk event', 
            teamId: newTeam._id,
            teamCode: newTeam.teamCode
        });

    } catch (error: any) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Gagal mendaftar tim', error: error.message });
    } finally {
        session.endSession();
    }
};

export const joinTeam = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { teamCode } = req.body;
        const userId = req.user?.userId;
        const userEmail = req.user?.email;

        // dapetin data user
        const user = await User.findOne({ email: userEmail }).session(session);

        if (!teamCode) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Kode tim harus disediakan.' });
        }

        // dapetin data team
        const team = await Team.findOne({ teamCode }).session(session);
        if (!team) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'Kode tim tidak ditemukan.' });
        }

        if (team.isLock) {
            await session.abortTransaction();
            return res.status(403).json({ message: 'Tim ini sudah dikunci dan tidak menerima anggota baru.' });
        }

        const existingGlobalMembership = await TeamMembership.findOne({ userId }).session(session);
        if (existingGlobalMembership) {
            await session.abortTransaction();
            return res.status(409).json({ message: 'Anda sudah terdaftar di tim lain.' });
        }

        const existingTeamMember = await Member.findOne({ teamId: team._id, email: userEmail }).session(session);
        if (existingTeamMember) {
             await session.abortTransaction();
             return res.status(409).json({ message: 'Anda sudah menjadi anggota tim ini.' });
        }

        const newTeamMembership = new TeamMembership({
            teamId: team._id,
            userId: userId
        });
        await newTeamMembership.save({ session });

        const newMember = new Member({
            teamId: team._id,
            email: userEmail,
        });
        await newMember.save({ session });
        
        // auto lock jika sudah 3 anggota
        const MAX_TEAM_MEMBERS = 3;
        const memberCounter = await Member.countDocuments({ teamId: team._id }).session(session);

        if (memberCounter >= MAX_TEAM_MEMBERS) {
            if (!team.isLock) {
                team.isLock = true;
                await team.save({ session });
            }
        }

        await session.commitTransaction();
        res.status(200).json({
            message: 'Berhasil bergabung ke tim',
            teamName: team.teamName,
            teamCode: team.teamCode
        });

    } catch (error: any) {
        await session.abortTransaction();
        res.status(500).json({ message: 'Gagal bergabung ke tim', error: error.message });
    } finally {
        session.endSession();
    }
};