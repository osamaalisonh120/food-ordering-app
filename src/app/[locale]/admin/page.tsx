import EditUserForm from "@/components/edit-user-form";
import { Pages, Routes } from "@/constants/enums";
import { Locale } from "@/i18n.config";
import getTrans from "@/lib/translation";
import { authOptions } from "@/server/auth";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const translations = await getTrans(locale);
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect(`/${locale}/${Routes.AUTH}/${Pages.LOGIN}`);
  }

  if (session && session.user.role !== "ADMIN") {
    redirect(`/${locale}/${Routes.PROFILE}`);
  }
  return (
    <main>
      <section className="section-gap">
        <div className="container">
          <EditUserForm user={session?.user} translations={translations} />
        </div>
      </section>
    </main>
  );
}

export default AdminPage;
