"use client"
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useSearchParams} from 'next/navigation'
import { useState } from "react";

export default function ResetPassword() {
    const params = useSearchParams()

    const [passwordNew, setPasswordNew] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handlePasswordNewChange = (event) => {
        const newPassword = event.target.value;
        setPasswordNew(newPassword);

        setIsValid(newPassword === passwordConfirm);
    };

    const handlePasswordConfirmChange = (event) => {
        const newPasswordConfirm = event.target.value;
        setPasswordConfirm(newPasswordConfirm);

        setIsValid(passwordNew === newPasswordConfirm);
    };

    const handlePasswordChange = async () => {
        setSuccess(false)
        if (!passwordNew) {
            setMessage("Vui lòng nhập mật khẩu mới");
            return;
        }
        if (passwordNew.length < 3) {
            setMessage("Mật khẩu phải lớn hơn 3 ký tự");
            return;
        }
        if (!passwordConfirm) {
            setMessage("Vui lòng nhập mật khẩu xác nhận");
            return;
        }
        if (!isValid) {
            setMessage("Mật khẩu xác nhận không khớp");
            return;
        }

        setIsLoading(true)
        try {
            const token = params.get('token')
            const response = await fetch(`http://localhost:3100/api/v1/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: passwordNew }),
            });

            const responseJson = await response.json();

            if (responseJson.status == 'Success') {
                setPasswordNew("");
                setPasswordConfirm("");
                setMessage(responseJson.message);
                setSuccess(true)
            } else {
                setMessage(responseJson.message);
                setSuccess(false)
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setIsLoading(false)
    };

    return (
        <Box
            position="absolute"
            top="50%"
            left="50%"
            padding="2rem 3rem"
            borderRadius="0.5rem"
            width="500px"
            border="1px solid #bdbdbd"
            sx={{
                transform: "translate(-50%, -50%)",
            }}
        >
            <Typography variant="h5" textAlign="center">
                Reset Password
            </Typography>
            {message && (
                <Typography textAlign="center" color={success ? "green" : "red"}>
                    {message}
                </Typography>
            )}
            <Stack direction="column" marginTop="2rem" gap={2}>
                <TextField
                    label="Password new"
                    variant="outlined"
                    type="password"
                    value={passwordNew}
                    onChange={handlePasswordNewChange}
                    error={passwordNew && passwordNew.length < 3 ? true : false}
                    helperText={passwordNew && passwordNew.length < 3 ? "Mật khẩu phải lớn hơn 3 ký tự" : ""}
                />
                <TextField
                    label="Password confirm"
                    variant="outlined"
                    type="password"
                    value={passwordConfirm}
                    onChange={handlePasswordConfirmChange}
                    error={passwordConfirm && passwordNew !== passwordConfirm ? true : false}
                    helperText={passwordConfirm && passwordNew !== passwordConfirm && "Mật khẩu xác nhận không khớp"}
                />
                <Button size="large" variant="contained" onClick={handlePasswordChange}>
                    Thay đổi mật khẩu
                </Button>
            </Stack>
        </Box>
    );
}

export const GetServerSideProps = async (context) => {
    // Accessing the query parameters
    const { token } = context.query;
    console.log(token)

    // Fetch data using the token or perform other server-side operations
    // ...

    // Pass data to the page via props
    return {
        props: {
            token
            // Your data
        },
    };
}
