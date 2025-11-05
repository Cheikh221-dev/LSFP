import express from 'express';
import { getTalents, createTalent } from '../controllers/talentController.js';


const router = express.Router();


router.get('/', getTalents);
router.post('/', createTalent);


export default router;