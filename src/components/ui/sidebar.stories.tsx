import { Meta } from '@storybook/react-vite';
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-react';

import { Logo } from '@/components/brand/logo';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default {
  title: 'Sidebar',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Sidebar>;

// Menu items.
const items = [
  {
    title: 'Home',
    url: 'https://github.com/Crazlol/TP-FAC',
    icon: Home,
  },
  {
    title: 'Inbox',
    url: 'https://github.com/Crazlol/TP-FAC',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    url: 'https://github.com/Crazlol/TP-FAC',
    icon: Calendar,
  },
  {
    title: 'Search',
    url: 'https://github.com/Crazlol/TP-FAC',
    icon: Search,
  },
  {
    title: 'Settings',
    url: 'https://github.com/Crazlol/TP-FAC',
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-auto"
                render={
                  <a
                    href="https://github.com/Crazlol/TP-FAC"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <Logo className="w-24" />
                    </span>
                  </a>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      render={
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      }
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-1 flex-col p-4">
          <SidebarTrigger />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
