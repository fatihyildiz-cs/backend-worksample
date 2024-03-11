/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreateDto:
 *       type: object
 *       required:
 *         - email
 *         - name
 *       properties:
 *         email:
 *           type: string
 *           description: The email of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *       example:
 *         email: user@example.com
 *         name: John Doe
 * 
 *     UserDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created.
 *       example:
 *         id: 65ed74a86543d2db567d00d8
 *         email: user@example.com
 *         name: John Doe
 *         createdAt: '2021-08-05T14:48:00.000Z'
 */
