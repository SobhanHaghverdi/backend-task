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
 * /api/products:
 *  get:
 *      summary: Filtering products list
 *      tags:
 *          -   Product
 *      parameters:
 *          -   in: query
 *              name: sort
 *              schema:
 *                  type: string
 *          -   in: query
 *              name: search
 *              schema:
 *                  type: string
 *          -   in: query
 *              name: pageNumber
 *              default: 1
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: pageSize
 *              default: 20
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: isActive
 *              schema:
 *                  type: boolean
 *          -   in: query
 *              name: warrantyActive
 *              schema:
 *                  type: boolean
 *          -   in: query
 *              name: minPrice
 *              default: ""
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: maxPrice
 *              default: ""
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: minAmper
 *              default: ""
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: maxAmper
 *              default: ""
 *              schema:
 *                  type: integer
 *                  format: int32
 *          -   in: query
 *              name: categoryIds
 *              default: ""
 *              description: "Split by ,"
 *              schema:
 *                  type: string
 *                  default: ""
 *          -   in: query
 *              name: subCategoryIds
 *              default: ""
 *              description: "Split by ,"
 *              schema:
 *                  type: string
 *                  default: ""
 *          -   in: query
 *              name: warrantyStartDateFrom
 *              default: ""
 *              schema:
 *                  type: string
 *                  format: date
 *          -   in: query
 *              name: warrantyStartDateTo
 *              default: ""
 *              schema:
 *                  type: string
 *                  format: date
 *          -   in: query
 *              name: warrantyEndDateFrom
 *              default: ""
 *              schema:
 *                  type: string
 *                  format: date
 *          -   in: query
 *              name: warrantyEndDateTo
 *              default: ""
 *              schema:
 *                  type: string
 *                  format: date
 *      responses:
 *          200:
 *              description: Object that contains total and data fields
 *          500:
 *              description: Unhandled exception
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
