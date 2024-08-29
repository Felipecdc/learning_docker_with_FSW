import validator from "validator";

export const checkIfIdIsValid = (id) => validator.isUUID(id);

export const invalidIdResponse = () => {
    return badRequest({
        message: "The provided id is not valid",
    });
};
