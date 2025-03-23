// import type { Req, Res } from "@interface/IApi";
// import { NextFunction } from "express";

// export function response(_req: Req, res: Res, next: NextFunction) {
//     // const errorProcessor = ErrorProcessor.getInstance();

//     // res.error = function(err: unknown) {
//     //   const violations = errorProcessor.process(err);
//     //   res.status(violations[0]?.code ?? 500).json(
//     //     ResponseDTO({
//     //       data: null,
//     //       message: {
//     //         vi: "Có lỗi xảy ra",
//     //         en: "An error occurred",
//     //       },
//     //       violations,
//     //     })
//     //   );
//     // };

//     // res.sendOk = function(params: OkParams) {
//     //   const {
//     //     data,
//     //     message = {
//     //       vi: "Thành công",
//     //       en: "Success",
//     //     },
//     //     statusCode = 200,
//     //     violations = [],
//     //   } = params;
//     //   console.log("data", data);
//     //   return res.status(statusCode).json(ResponseDTO({ data, message, violations }));
//     // };

//     _req.on("end", () => {
//       console.log("end");
//     });

//     // res.on("finish", () => {
//     //   console.log("finish");
//     // });

//     next();
//   };

// export default response;
