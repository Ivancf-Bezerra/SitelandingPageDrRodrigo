import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SiteImagesService } from './services/site-images.service';

export function appInitializerFactory(
  images: SiteImagesService,
  auth: AuthService,
): () => Promise<void> {
  return () =>
    firstValueFrom(
      forkJoin([
        images.load().pipe(catchError(() => of(undefined))),
        auth.restoreSession().pipe(catchError(() => of(undefined))),
      ]),
    ).then(() => void 0);
}
