const { register, login, getProfile } = require("../services/authService");
const { success, error } = require("../utils/apiResponse");

// ================================================================
// authController.js — يستقبل الطلبات ويُرسل الردود
//
// قاعدة مهمة: Controller لا يحتوي على منطق عمل!
// كل الـ logic في authService — هنا فقط:
//   1. استخراج البيانات من req.body
//   2. استدعاء الـ service
//   3. إرسال الرد
// ================================================================

const registerController = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await register({ email, password, firstName, lastName });
    return success(res, result, "Compte créé avec succès", 201);
  } catch (err) {
    next(err); // إرسال الخطأ إلى errorMiddleware
  }
};

const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await login({ email, password });
    return success(res, result, "Connexion réussie");
  } catch (err) {
    next(err);
  }
};

const getProfileController = async (req, res, next) => {
  try {
    // req.user.id يأتي من authMiddleware بعد التحقق من الـ JWT
    const user = await getProfile(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
};

module.exports = { registerController, loginController, getProfileController };
