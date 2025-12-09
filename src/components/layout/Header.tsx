/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"; // Nécessaire pour les hooks comme useState et useAuthStore

import Link from "next/link";
import { Search, Bell, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {/* Vous pouvez remplacer ceci par votre logo SVG */}
          <div className="h-8 w-8 rounded bg-primary" />
          <span className="font-bold text-xl">InfoSanté CM</span>
        </Link>

        {/* Barre de recherche (visible sur desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une annonce, un hôpital..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Actions à droite */}
        <div className="flex items-center space-x-2">
          {isAuthenticated && user ? (
            // --- Vue pour un utilisateur connecté ---
            <>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                {/* Vous pourriez ajouter un Badge ici pour les notifications non lues */}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || ""} alt={user.firstName || 'A'} />
                      <AvatarFallback>
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profil">
                      <User className="mr-2 h-4 w-4" />
                      <span>Mon Profil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profil/preferences">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Préférences</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Se déconnecter</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // --- Vue pour un visiteur non connecté ---
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/connexion">Connexion</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/inscription">S&apos;inscrire</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}