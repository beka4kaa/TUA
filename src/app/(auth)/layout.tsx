export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}
