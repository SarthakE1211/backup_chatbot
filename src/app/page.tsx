import AppShell from "@/components/landing/AppShell";
import { SITE_META } from "@/constants/copy";

export const metadata = {
    title: SITE_META.title,
    description: SITE_META.description,
};

export default function Home() {
    return (
        <AppShell />
    );
}
