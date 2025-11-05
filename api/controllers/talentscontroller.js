import prisma from '../lib/prisma.js';


export const getTalents = async (req, res) => {
const talents = await prisma.talent.findMany();
res.json(talents);
};


export const createTalent = async (req, res) => {
const { nom, age, position, club, description, videoUrl } = req.body;
const newTalent = await prisma.talent.create({ data: { nom, age, position, club, description, videoUrl } });
res.status(201).json(newTalent);
};