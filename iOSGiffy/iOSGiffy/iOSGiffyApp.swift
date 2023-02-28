//
//  iOSGiffyApp.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-17.
//

import SwiftUI
import FirebaseCore
import GoogleSignIn

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
        FirebaseApp.configure()

        return true
    }
    
    @available(iOS 9.0, *)
    func application(_ application: UIApplication, open url: URL,
                    options: [UIApplication.OpenURLOptionsKey: Any])
        -> Bool {
        return GIDSignIn.sharedInstance.handle(url)
    }
}

@main
struct iOSGiffyApp: App {
    // register app delegate for Firebase setup
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @AppStorage("signIn") var isSignIn = false

    var body: some Scene {
        WindowGroup {
            if(isSignIn) {
                ContentView()
            } else {
                SignInView()
            }
        }
    }
}
