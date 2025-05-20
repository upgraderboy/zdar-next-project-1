import Link from "next/link"

export const NavLinks = () => {
    // TODO: Add search functionality
    const navbarLinks = [
        { linkName: 'Home', link: '/' },
        { linkName: 'About', link: '/about' },
        { linkName: 'Services', link: '/services' },
        { linkName: 'Partnerships & Media', link: '/partnership-media' },
        { linkName: 'Pricing Plan', link: '/pricing-plan' }
      ];
    return (
        <div className="flex items-center gap-6">
          <div className="hidden md:flex gap-10 items-center">
            {navbarLinks.map((navItem, index) => (
              <Link
                key={index}
                href={navItem.link}
                className="text-white hover:text-gray-300"
              >
                {navItem.linkName}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            
            <div className="flex items-center gap-4">
              <div className="md:flex items-center gap-2 hidden">


              </div>
            </div>
          </div>
        </div>
    )
}