package com.gmail.matejpesl1.companion;
import android.webkit.CookieManager;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public void onPause() {
        super.onPause();

        // https://github.com/ionic-team/capacitor/issues/3012#issuecomment-636017770
        // Do this shit to preserve cookies in our Capacitor app.
        CookieManager.getInstance().flush();
    }
}
