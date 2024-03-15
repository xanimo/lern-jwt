module.exports = {
	app: {
		title: 'lern-stack',
		description: 'lern boilerplate',
		keywords: 'Level Express React Node',
		googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID' 
	},
	port: process.env.PORT || 3001,
	tokenTimeout: 3600,
	appSecret: process.env.APP_SECRET || 'zv9XwtTaITx7xEpuNHSooELlD1',
	favicon: 'client/public/favicon.ico'
};