import validator from "validator";
import { badRequest } from "./http.js";

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () => {
    return badRequest({
        message: "The provided id is not valid",
    });
};

export const checkIfIsString = (value) => typeof value === "string";

export const validateRequiredFileds = (params, requiredFields) => {
    for (const field of requiredFields) {
        const fieldsIsMissing = !params[field];
        const fieldsIsEmpty =
            checkIfIsString(params[field]) &&
            validator.isEmpty(params[field], { ignore_whitespace: false });

        if (fieldsIsMissing || fieldsIsEmpty) {
            return {
                ok: false,
                missingField: field,
            };
        }
    }
    return {
        ok: true,
        missingField: undefined,
    };
};
