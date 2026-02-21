// Application imports:
import { PageLogo } from "../../../../assets/icons/PageLogo";
import { useAuthStore } from "../../../../stores/authStore";
import { useNavigate, NavLink } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { register, login } from "../../api/authApi";
import classes from "./RegisterPage.module.css";
import { useState } from "react";
import axios from "axios";

// Mantine:
import {
  PasswordInput,
  TextInput,
  Container,
  Checkbox,
  Anchor,
  Button,
  Center,
  Title,
  Group,
  Paper,
  Text,
  Stack,
} from "@mantine/core";

export function RegisterPage() {
  // Hooks and state:
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  // New user form state:
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  //  Form submission handler:
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1: Register user:
      await register({
        username,
        email,
        password1,
        password2,
        first_name: firstName,
        last_name: lastName,
      });

      // 2: Immediately login after successful registration:
      const { user, access, refresh } = await login({
        email,
        password: password1,
      });

      // 3: Persist auth state:
      setAuth(user, access, refresh, rememberMe);

      // 4: Redirect to profile:
      navigate("/auth/profile");

      notifications.show({
        title: "Account created",
        message: "You have been logged in successfully.",
        color: "teal",
        withBorder: true,
      });

    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.page_error?.error_message ??
          "Registration failed"
        : "Unexpected error occurred";

      notifications.show({
        title: "Registration failed",
        message,
        color: "red",
        withBorder: true,
        autoClose: 10000,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size={420}>
      <Center>
        <NavLink to="/" aria-label="AlpenWegs Homepage">
          <PageLogo size={200} />
        </NavLink>
      </Center>

      <Title ta="center" className={classes.title}>
        Create your account
      </Title>

      <Text className={classes.subtitle}>
        Already have an account?{" "}
        <Anchor component={NavLink} to="/auth/login">
          Log in
        </Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={24} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">

            <TextInput
              label="Username"
              required
              radius="md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={classes.registerPageInput}
            />

            <Group grow>
              <TextInput
                label="First name"
                required
                radius="md"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={classes.registerPageInput}
              />

              <TextInput
                label="Last name"
                required
                radius="md"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={classes.registerPageInput}
              />
            </Group>

            <TextInput
              label="Email"
              type="email"
              required
              radius="md"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className={classes.registerPageInput}
            />

            <PasswordInput
              label="Password"
              required
              radius="md"
              value={password1}
              autoComplete="new-password"
              onChange={(e) => setPassword1(e.target.value)}
              className={classes.registerPageInput}
            />

            <PasswordInput
              label="Confirm password"
              required
              radius="md"
              value={password2}
              autoComplete="new-password"
              onChange={(e) => setPassword2(e.target.value)}
              className={classes.registerPageInput}
            />

            <Checkbox
              label="Keep me logged in"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />

            <Button
              type="submit"
              fullWidth
              radius="md"
              loading={loading}
              disabled={loading}
            >
              Register
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}