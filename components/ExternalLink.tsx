import { Link } from 'expo-router';
import { openBrowserAsync } from 'expo-web-browser';
import { type ComponentProps } from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

export function ExternalLink({ href, ...rest }: Props) {
	//	when href is empty, return an empty component
	if (!href) return <></>;

	//	when the link is pressed
	const linkOnPress = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => {
		if (Platform.OS === 'web') return;
		event.preventDefault();
		await openBrowserAsync(href);
	}

	return (
		<Link
			target="_blank"
			{...rest}
			href={href as any}
			onPress={linkOnPress}
		/>
	);
}
