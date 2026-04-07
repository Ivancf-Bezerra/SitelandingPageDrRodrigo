import { catchError, firstValueFrom, forkJoin, of } from 'rxjs';
import { ApiRuntimeConfigService } from './services/api-runtime-config.service';
import { AuthService } from './services/auth.service';
import { SiteImagesService } from './services/site-images.service';

export function appInitializerFactory(
  apiConfig: ApiRuntimeConfigService,
  images: SiteImagesService,
  auth: AuthService,
): () => Promise<void> {
  return () =>
    apiConfig
      .load()
      .then(() =>
        firstValueFrom(
          forkJoin([
            images.load().pipe(catchError(() => of(undefined))),
            auth.restoreSession().pipe(catchError(() => of(undefined))),
          ]),
        ),
      )
      .then(() => void 0);
}
