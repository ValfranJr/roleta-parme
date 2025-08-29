import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE_NAME = "admin_session";

export async function setAdminSession(username: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Error setting admin session:", error);
    throw new Error("Failed to set admin session");
  }
}

export async function clearAdminSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error("Error clearing admin session:", error);
    throw new Error("Failed to clear admin session");
  }
}

export async function getAdminSession(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    return cookie?.value;
  } catch (error) {
    console.error("Error getting admin session:", error);
    return undefined;
  }
}

export async function requireAdminAuth() {
  try {
    const session = await getAdminSession();
    if (!session) {
      redirect("/admin/login");
    }
  } catch (error) {
    console.error("Error checking admin auth:", error);
    redirect("/admin/login");
  }
}

// Função auxiliar para verificar se o usuário está autenticado sem redirecionar
export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const session = await getAdminSession();
    return !!session;
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return false;
  }
}
