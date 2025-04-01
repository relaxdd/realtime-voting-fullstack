import { AppLinks } from '@/shared/defines.ts';
import { Avatar, AvatarFallback, AvatarImage } from '@shadcn/avatar.tsx';
import { Button } from '@shadcn/button.tsx';
import { useAuthContext } from '@/providers/auth-provider.tsx';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shadcn/dropdown-menu.tsx';
import { LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

const HeaderLoginArea = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  
  if (!user) {
    return (
      <Button
        variant="outline"
        className="cursor-pointer"
        onClick={() => navigate(AppLinks.login)}
      >
        <LogIn />{' '}Войти
      </Button>
    );
  }
  
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-row items-center gap-x-3 cursor-pointer">
          <small>@{user.username}</small>
          
          <Avatar>
            <AvatarImage
              src={user.avatarUrl || ''}
              alt="avatar-url"
              fetchPriority="high"
              decoding="async"
            />
            
            <AvatarFallback>
              {(user.username || '')?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent className="w-56" align="end" sideOffset={20}>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <Link to="/profile" className="text-foreground! hover:opacity-100!">Profile</Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem>Billing</DropdownMenuItem>
          
          <DropdownMenuSeparator />
          <DropdownMenuItem><Link to={AppLinks.logout}>Log out</Link></DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default HeaderLoginArea;