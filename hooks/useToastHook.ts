import { useState } from "react";
import Toast, { ToastShowParams } from "react-native-toast-message"
/**
 * Toast hook for showing and hiding toasts
 * @author calintamas
 * @description https://github.com/calintamas/react-native-toast-message/tree/main
 * @returns 
 */
export default function useToastHook() {
	
	const showToast = (params: ToastShowParams) => {
		Toast.show({
			...params,
			type: params.type,
			text1: params.text1,
			text2: params.text2,
			position: 'bottom',
			autoHide: true,
		} as ToastShowParams)
	}

	const hideToast = () => {
		Toast.hide()
	}

	return {
		showToast,
		hideToast
	}
}
