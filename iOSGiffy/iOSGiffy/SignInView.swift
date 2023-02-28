//
//  SignInView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import SwiftUI
import Firebase
import FirebaseAuth
import GoogleSignIn

struct SignInView: View {
    var body: some View {
        VStack {
            GoogleSiginBtn {
                CustomFirebaseAuth.share.signinWithGoogle(presenting: self.getRootViewController()) { error in
                    print("ERROR: \(error)")
                }
            }
        }
        .padding(.top, 52)
        Spacer()
    }
}

struct SignInView_Previews: PreviewProvider {
    static var previews: some View {
        SignInView()
    }
}
