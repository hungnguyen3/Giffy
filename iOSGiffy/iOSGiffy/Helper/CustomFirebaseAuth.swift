//
//  FirebaseAuth.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import Foundation
import FirebaseAuth
import GoogleSignIn
import Firebase

struct CustomFirebaseAuth {
    static let share = CustomFirebaseAuth()
    
    private init() {}
    
    func signinWithGoogle(presenting: UIViewController,
                          completion: @escaping (Error?) -> Void) {
        guard let clientID = FirebaseApp.app()?.options.clientID else { return }

        // Create Google Sign In configuration object.
        let config = GIDConfiguration(clientID: clientID)
        GIDSignIn.sharedInstance.configuration = config

        // Start the sign in flow with the provided presenting view controller.
        GIDSignIn.sharedInstance.signIn(withPresenting: presenting) { signResult, error in

            if let error = error {
                completion(error)
                return
            }

            guard let user = signResult?.user,
                       let idToken = user.idToken else { return }
                 
                 let accessToken = user.accessToken
                        
                 let credential = GoogleAuthProvider.credential(withIDToken: idToken.tokenString, accessToken: accessToken.tokenString)

            Auth.auth().signIn(with: credential) { result, error in
                guard error == nil else {
                    completion(error)
                    return
                }
                
                print("Sign in")
                UserDefaults.standard.set(true, forKey: "signIn")
            }
        }
    }
    
    func signOut(completion: @escaping (Error?) -> Void) {
        do {
            // Sign out from Firebase
            try Auth.auth().signOut()
            
            // Sign out from Google
            GIDSignIn.sharedInstance.signOut()
            
            // Update UserDefaults
            UserDefaults.standard.set(false, forKey: "signIn")
            
            completion(nil)
        } catch let error {
            completion(error)
        }
    }
}
