export interface IMenuItem {
	name: string
	url: string
	icon: string
}

export const MENU_DATA: IMenuItem[] = [
	{
		icon: 'radix-icons:dashboard',
		name: 'Home',
		url: '/',
	},
	{
		name: 'Payments',
		icon: 'ph:contactless-payment',
		url: '/payments',
	},
	{
		name: 'Customers',
		icon: 'mingcute:group-line',
		url: '/customers',
	},
	{
		name: 'Feedback',
		icon: 'fluent:person-feedback-48-regular',
		url: '/feedback',
	},
	{
		name: 'Help center',
		icon: 'radix-icons:question-mark',
		url: '/help',
	},
]
