import { Router } from "express";
import { postLogin, postSignUp } from "../controllers/authController.js";

const router = Router();

router.post('/login', postLogin);
router.post('/sign-up', postSignUp);

export default router;

