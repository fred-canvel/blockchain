import React, { useEffect, useRef, memo } from 'react';

function SingleTicker({ symbol = "BINANCE:BTCUSDT" }) {
    const container = useRef();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-single-quote.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = `
      {
        "symbol": "${symbol}",
        "width": "100%",
        "isTransparent": false,
        "colorTheme": "dark",
        "locale": "en"
      }`;
        container.current.innerHTML = "";
        container.current.appendChild(script);
    }, [symbol]);

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget"></div>
        </div>
    );
}

export default memo(SingleTicker);
