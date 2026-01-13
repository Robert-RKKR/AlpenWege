// Application imports:
import { useAuthStore } from "../../../../stores/authStore";
import { PageLogo } from "../../../../assets/icons/PageLogo";
import { useNavigate, NavLink } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import classes from "./LoginPage.module.css";
import { login } from "../../api/authApi";
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

// LoginPage component:
export function LoginPage() {

  // React Router navigation helper
  const navigate = useNavigate();

  // Auth store action to persist user + tokens
  const setAuth = useAuthStore((s) => s.setAuth);

  // Login form states:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  // Indicates whether login request is in progress
  const [loading, setLoading] = useState(false);

  // Form submission handler
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent default browser form submission
    e.preventDefault();

    // Disable submit button and show loader
    setLoading(true);

    try {
      // Call login API with credentials
      const { user, access, refresh } = await login({ email, password });

      // Persist authentication state (user + tokens)
      setAuth(user, access, refresh, rememberMe);

      // Redirect to user profile after successful login
      navigate("/auth/profile");
    } catch (err) {
      // Resolve a user-friendly error message
      const message = axios.isAxiosError(err)
        ? err.response?.data?.page_error?.error_message ??
          "Invalid email or password"
        : "Unexpected error occurred";

      // Show toast-style error notification
      notifications.show({
        title: "Login failed",
        message,
        color: "red",
        withBorder: true,
        autoClose: 10000,
      });
    } finally {
      // Re-enable submit button
      setLoading(false);
    }
  }

  return (
    <Container size={420}>
      {/* Application logo / home link */}
      <Center>
        <NavLink to="/" aria-label="AlpenWegs Homepage">
          <PageLogo size={200} />
        </NavLink>
      </Center>

      {/* Page title */}
      <Title ta="center" className={classes.title}>
        Welcome back
      </Title>

      {/* Registration hint */}
      <Text className={classes.subtitle}>
        Do not have an account yet?{" "}
        <Anchor component={NavLink} to="/auth/register">
          Create account
        </Anchor>
      </Text>

      {/* Login form container */}
      <Paper withBorder shadow="sm" p={24} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            {/* Email input */}
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              radius="md"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
              className={classes.loginPageInput}
            />

            {/* Password input */}
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              radius="md"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className={classes.loginPageInput}
            />

            {/* Remember me + forgot password */}
            <Group justify="space-between">
              <Checkbox
                label="Keep me logged in"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />

              <Anchor component="button" size="sm">
                Forgot password?
              </Anchor>
            </Group>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              radius="md"
              loading={loading}
              disabled={loading}
            >
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
