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
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { teamName, paymentProofUrl, teamMembers } = req.body; 
        const creatorUserId = req.user?.userId;
        const creatorEmail = req.user?.email;

        const allMemberEmails = [...new Set([creatorEmail, ...teamMembers.map((m: any) => m.email)])];

        const users = await User.find({ email: { $in: allMemberEmails } }).select('_id email name').session(session);

        if (users.length !== allMemberEmails.length) {
            const foundEmails = users.map(u => u.email);
            const notFoundEmails = allMemberEmails.filter(email => !foundEmails.includes(email as string));
            await session.abortTransaction();
            return res.status(404).json({
                message: `User dengan email berikut tidak ditemukan: ${notFoundEmails.join(', ')}. Pastikan semua anggota telah mendaftar.`,
            });
        }

        const allUserIds = users.map(user => user._id);

        const existingMembership = await TeamMembership.findOne({ userId: { $in: allUserIds } }).session(session);
        if (existingMembership) {
            const memberInTeam = users.find(u => String(u._id) === String(existingMembership.userId));
            await session.abortTransaction();
            return res.status(409).json({ message: `User ${memberInTeam?.email} sudah terdaftar di tim lain.` });
        }

        const newTeamCode = await generateUniqueTeamCode();
        const newTeam = new Team({
            teamCode: newTeamCode,
            teamName,
            paymentProofUrl,
            isPay: false,
            isLock: false,
            isQualified: false,
            email: creatorEmail 
        });
        await newTeam.save({ session });

        const membershipsToCreate = allUserIds.map(userId => ({
            teamId: newTeam._id,
            userId: userId
        }));
        await TeamMembership.insertMany(membershipsToCreate, { session });

        const membersToInsert = users.map(user => ({
            name: user.name,
            email: user.email,
            teamId: newTeam._id
        }));
        await Member.insertMany(membersToInsert, { session });
        
        const MAX_TEAM_MEMBERS = 3;
        if (allUserIds.length >= MAX_TEAM_MEMBERS) {
            newTeam.isLock = true;
            await newTeam.save({ session });
        }

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

        const user = await User.findById(userId).session(session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        if (!teamCode) {
            await session.abortTransaction();
            return res.status(400).json({ message: 'Kode tim harus disediakan.' });
        }

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
            name: user.name, 
            email: userEmail,
        });
        await newMember.save({ session });
        
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
