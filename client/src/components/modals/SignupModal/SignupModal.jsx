import "./styles.css";

import { toast } from "react-hot-toast";

import { useAppSelector, useAppDispatch } from "../../../app/store";
import { modalActions } from "../../../features/slices/modalSlice";
import { registerActions } from "../../../features/slices/registerSlice";

import {
    useLazyCheckUsernameQuery,
    useLazyCheckEmailQuery,
    useSignUpMutation,
} from "../../../features/api/authApi";

import {
    BaseModal,
    ColumnHeader,
    TextInput,
    Logo
} from "../../index";

const SignupModal = ({ isOpen, closeModal }) => {
    const formState = useAppSelector((state) => state.register.form);
    const dispatch = useAppDispatch();

    const [validateUsername, {
        data: usernameStatus,
        error: usernameFetchError
    }] = useLazyCheckUsernameQuery();

    const [validateEmail, {
        data: emailStatus,
        error: emailFetchError
    }] = useLazyCheckEmailQuery();

    const [signUp, { error: signUpError }] = useSignUpMutation();


    const handleUsernameBlur = ({ target }) => {
        validateUsername(formState.username)
    }

    const handleEmailBlur = ({ target }) => {
        validateEmail(formState.email);
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const result = await signUp(formState);

        if (result.error) {
            return toast.error(result.error.message);
        }

        if (result?.data?.id && !result.error) {
            closeSignUpModal();
            dispatch(modalActions.openModal({
                name: "VerificationModal",
                props: { userId: result.data.id }
            }))
        }
    };

    const closeSignUpModal = () => {
        dispatch(registerActions.clearForm());
        closeModal();
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={closeSignUpModal}
            className="signup-modal"
        >
            <ColumnHeader
                className="signup-modal_header"
                closeModal={true}
            >
                <div className="header_container">
                    <div className="logo-container">
                        <Logo />
                    </div>
                </div>
            </ColumnHeader>


            <h2 className="signup-modal_form-header">Create your account</h2>

            <form
                onSubmit={handleSignUp}
                className="signup-modal_form"
            >
                <TextInput
                    type="text"
                    name="name"
                    id="name"
                    label="Name"
                    value={formState.displayName}
                    onChange={({ target }) => dispatch(
                        registerActions.updateForm({
                            name: "displayName",
                            value: target.value
                        })
                    )}
                />

                <TextInput
                    type="text"
                    id="email"
                    name="email"
                    label="Email"
                    error={emailStatus || emailFetchError}
                    value={formState.email}
                    onChange={({ target }) => dispatch(
                        registerActions.updateForm({
                            name: "email",
                            value: target.value
                        })
                    )}
                    onBlur={handleEmailBlur}
                />

                <div className="signup-modal_input-container">
                    <p>Your @username is unique. You can always change it later.</p>

                    <TextInput
                        type="text"
                        id="username"
                        name="username"
                        label="Username"
                        error={usernameStatus || usernameFetchError}
                        value={formState.username}
                        onChange={({ target }) => dispatch(
                            registerActions.updateForm({
                                name: "username",
                                value: target.value
                            })
                        )}
                        onBlur={handleUsernameBlur}
                    />
                </div>

                <div className="signup-modal_input-container">
                    <p>Make sure the password is 8 characters or more.</p>

                    <TextInput
                        type="password"
                        id="password"
                        name="password"
                        label="Password"
                        // error={passwordError}
                        value={formState.password}
                        onChange={({ target }) => dispatch(
                            registerActions.updateForm({
                                name: "password",
                                value: target.value
                            })
                        )}
                    />
                </div>

                <button
                    className="white-btn btn-next"
                    onClick={handleSignUp}
                    disabled={
                        !formState.displayName ||
                        !formState.email ||
                        !formState.username ||
                        !formState.password ||
                        emailFetchError ||
                        usernameFetchError
                    }
                >
                    Next
                </button>
            </form>
        </BaseModal>
    );
};

export default SignupModal;
