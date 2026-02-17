export default function PublicFooter() {
  return (
    <footer className="border-t py-6 text-center text-sm text-muted-foreground">
      © {new Date().getFullYear()} Ledgerly. All rights reserved.
    </footer>
  );
}
