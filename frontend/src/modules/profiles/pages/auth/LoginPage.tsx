// Application imports:
import { useAuthStore } from "../../../../stores/authStore";
import { PageLogo } from "../../../../assets/icons/PageLogo";
import { useNavigate, NavLink } from "react-router-dom";
import { login } from "../../api/authApi";
import { useState } from "react";
import axios from "axios";

// Mantine:
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Center,
  Stack,
} from "@mantine/core";

// Styles:
import classes from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  // Form state:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // UI state:
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { user, access, refresh } = await login({ email, password });
      setAuth(user, access, refresh, rememberMe);
      navigate("/auth/profile");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.page_error?.error_message ??
            "Invalid email or password"
        );
      } else {
        setError("Unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container size={420}>
      {/* Logo */}
      <Center>
        <NavLink to="/" aria-label="AlpenWegs Homepage">
          <PageLogo size={200} />
        </NavLink>
      </Center>

      {/* Title */}
      <Title ta="center" className={classes.title}>
        Welcome back
      </Title>

      <Text className={classes.subtitle}>
        Do not have an account yet?{" "}
        <Anchor component={NavLink} to="/auth/register">
          Create account
        </Anchor>
      </Text>

      {/* Form card */}
      <Paper withBorder shadow="sm" p={24} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              label="Email"
              placeholder="you@example.com"
              required
              radius="md"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              radius="md"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />

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

            {error && (
              <Text c="red" size="sm">
                {error}
              </Text>
            )}

            <Button
              type="submit"
              fullWidth
              radius="md"
              loading={loading}
            >
              Log in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
