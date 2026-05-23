import { registerRootComponent } from 'expo';

// Install global handlers early to capture initialization-time errors
try {
	const rnGlobal: any = global as any;
	if (rnGlobal?.ErrorUtils && typeof rnGlobal.ErrorUtils.setGlobalHandler === 'function') {
		rnGlobal.ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
			console.error('🚨 Early Global JS Error (ErrorUtils):', error, 'isFatal:', isFatal, '\nstack:', error?.stack);
			try {
				const prev = rnGlobal.ErrorUtils.getGlobalHandler && rnGlobal.ErrorUtils.getGlobalHandler();
				if (prev && prev !== rnGlobal.ErrorUtils.setGlobalHandler) prev(error, isFatal);
			} catch (e) {
				// ignore
			}
		});
	}
} catch (e) {
	// ignore
}

import App from './App';

registerRootComponent(App);
