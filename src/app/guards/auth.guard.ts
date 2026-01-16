import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const roleGuard = (requiredPermission: 'add' | 'update' | 'delete') => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    let hasPermission = false;
    switch (requiredPermission) {
      case 'add':
        hasPermission = authService.canAdd();
        break;
      case 'update':
        hasPermission = authService.canUpdate();
        break;
      case 'delete':
        hasPermission = authService.canDelete();
        break;
    }

    if (!hasPermission) {
      router.navigate(['/records']);
      return false;
    }

    return true;
  };
};
