import React from "react";

export function usePasswordStrengthEvaluatorHook() 
{
    const [containLowercase, setContainLowercase] = React.useState<boolean>(false);
    const [containUppercase, setContainUppercase] = React.useState<boolean>(false);
    const [containNumber, setContainNumber] = React.useState<boolean>(false);
    const [containSpecial, setContainSpecial] = React.useState<boolean>(false);
    const [lengthMet, setLengthMet] = React.useState<boolean>(false);
    const [passwordEvalScore, setPasswordEvalScore] = React.useState<number>(0);

    //  Set the password evaluation score
    //  This is a simple evaluation score based on the password criteria
    //  Each criteria is worth 20 points, for a total of 100 points
    React.useEffect(() => {
        const score = (containLowercase ? 20 : 0) + (containUppercase ? 20 : 0) + (containNumber ? 20 : 0) + (containSpecial ? 20 : 0) + (lengthMet ? 20 : 0);
        setPasswordEvalScore(score);
    }, [containLowercase, containUppercase, containNumber, containSpecial, lengthMet]);

    /**
     * When the password field changes, update the password state and evaluate the password
     * @param {string} value - The value of the password field
     * @returns {void}
     */
    const evaluatePassword = (value: string): void => {
        if (value) 
        {
            setContainLowercase(/[a-z]/.test(value));
            setContainUppercase(/[A-Z]/.test(value));
            setContainNumber(/[0-9]/.test(value));
            setContainSpecial(/[!@#$%^&*?:{}|<>_\-~;=+]/.test(value));
            setLengthMet(value.length >= 8);
        } else {
            setPasswordEvalScore(0);
        }
    }

    const passwordEvalCleanup = () => {
        setContainLowercase(false);
        setContainUppercase(false);
        setContainNumber(false);
        setContainSpecial(false);
        setLengthMet(false);
        setPasswordEvalScore(0);
    }

    return {
        passwordEvalScore,
        evaluatePassword,
        passwordEvalCleanup,
    }
}