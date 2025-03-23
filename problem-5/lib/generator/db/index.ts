import { SequelizeAuto } from "sequelize-auto";

export const auto = new SequelizeAuto(
    "db",
    "user",
    "password",
    {
        host: "localhost",
        dialect: "postgres",
        directory: "src/repository/model",
        additional: {
            timestamps: true,
            paranoid: true,
        },
        port: 5434,
        caseModel: "p",
        caseFile: "c",
        singularize: true,
        schema: "public",
        tables: ["Products"],
        useDefine: true,
        lang: "ts",
        
    }
)

auto.run().then(() => {
    console.log("Models generated successfully");
}).catch((err) => {
    console.error(err);
})