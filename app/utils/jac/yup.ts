import * as Yup from "yup";

export const FaqSchema = Yup.object().shape({
    question: Yup.string().required(),
    answer: Yup.string().required()
});

export const getValidationErrors = (err: any) => {
    const validateError = {} as any;
    err.inner.forEach((error:any)=>{
        if(error.path) {
            validateError[error.path] = error.message;
        }
    });
    return validateError;
}