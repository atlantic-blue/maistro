interface HtmlProps {
    head: string;
    body: {
        main: string;
        scripts: string;
    };
    htmlAttributes: string;
    bodyAttributes: string;
}

const Html = ({ htmlAttributes, bodyAttributes, head, body }: HtmlProps) => {
    return `
        <!DOCTYPE html>
        <html ${htmlAttributes}>

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <link rel="icon" type="image/x-icon" href="/public/favicon.png">
            <meta name="author" content="Maistro via Atlantic Blue Solutions UK">
            ${head}

            <!-- Google tag (gtag.js) -->
            <script async
                src="https://www.googletagmanager.com/gtag/js?id=G-MM3M15CX9Z"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag() { dataLayer.push(arguments); }
                gtag('js', new Date());

                gtag('config', 'G-MM3M15CX9Z');
            </script>

            <!-- Meta Pixel Code -->
            <script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1211682693974756');
            fbq('track', 'PageView');
            </script>
            <noscript><img height="1" width="1" style="display:none"
            src="https://www.facebook.com/tr?id=1211682693974756&ev=PageView&noscript=1"
            /></noscript>
            <!-- End Meta Pixel Code -->

            <!-- Microsoft Clarity Code -->
            <script type="text/javascript">
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "s1xds7d0te");
            </script>
        </head>

        <body ${bodyAttributes}>
            <main id="main">
                ${body.main}
            </main>
            ${body.scripts}
        </body>

        </html >
    `;
};

export { Html as default };
