const { verify } = require("jsonwebtoken");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication operations
 *
 * @swagger
 * components:
 *   parameters:
 *     accessToken:
 *       in: header
 *       name: accessToken
 *       required: true
 *       schema:
 *         type: string
 *
 * @swagger
 * securitySchemes:
 *   BearerAuth:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *
 * @swagger
 * /:
 *   post:
 *     summary: Validate user token
 *     description: Check if the user token is valid and attach user information to the request object.
 *     parameters:
 *       - $ref: '#/components/parameters/accessToken'
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid. User information attached to the request object.
 *       401:
 *         description: User not logged in or invalid token.
 */
const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken");

  if (!accessToken) return res.json({ error: "user not logged in" });

  try {
    const validToken = verify(accessToken, "important_secret");
    req.user = validToken;

    if (validToken) {
      return next();
    }
  } catch (error) {
    res.json({ error: error });
  }
};

module.exports = { validateToken };
