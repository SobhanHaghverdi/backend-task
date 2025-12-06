/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Product modules and routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          ImportProduct:
 *              type: object
 *              required:
 *                  -   excelFile
 *              properties:
 *                  excelFile:
 *                      type: string
 *                      format: binary
 */

/**
 * @swagger
 * /api/products/import:
 *   post:
 *     summary: Import products using excel file
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *              $ref: "#/components/schemas/ImportProduct"
 *     responses:
 *       200:
 *         description: Success
 *       422:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
