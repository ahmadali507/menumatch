import UserDropdown from "./ui/user-dropdown";


export function SiteHeader() {

  const userData = {
    name: "John Doe",
    email: "john@gmail.com",
    role: "Super Admin",
    avatar: "https://randomuser.me/api/portraits"
  }

  return (
    <header className="pr-6 py-3 sticky top-0 h-14 flex justify-end z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">

      <div className="flex items-center gap-4">
        {/* <UserDropdown /> */}
        <UserDropdown {...userData} />
      </div>
    </header>
  )
}

