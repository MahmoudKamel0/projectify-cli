import { NpmWordmark } from "./ui/svgs/npmWordmark";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn.util";
import { Github } from "lucide-react";

interface WelcomeComponentProps {
    className?: string;
}

export default function WelcomeComponent({ className }: WelcomeComponentProps) {
    return (
        <section className={cn(className)}>
            <div className="h-screen container mx-auto">
                <div className="h-full flex flex-col items-center justify-center gap-5">
                    <img src="/images/global/proxy-logo.svg" alt="logo" width="200" height="100" />
                    <h2 className="text-center text-3xl font-semibold">
                        A CLI tool for fast and
                        <br />
                        <span className="text-muted-foreground/80">consistent project scaffolding</span>
                    </h2>
                    <div className="flex items-center gap-4">
                        <Button size="lg" variant="outline" asChild>
                            <a href="https://github.com/MahmoudKamel0/projectify-cli" target="_blank" className="size-10">
                                <Github />
                            </a>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <a href="https://shadcnblocks.com" target="_blank" className="size-10">
                                <NpmWordmark />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
