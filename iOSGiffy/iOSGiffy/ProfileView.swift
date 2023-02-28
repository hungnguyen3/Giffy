//
//  ContentView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-17.
//

import SwiftUI

struct ProfileView: View {
    var body: some View {
        VStack {
            Text("Profile")
                .padding()
            
            Button("Sign out") {
                CustomFirebaseAuth.share.signOut { error in
                    if let error = error {
                        print("Failed to sign out:", error)
                    } else {
                        print("Successfully signed out")
                    }
                }
            }
            .padding()
        }
        .edgesIgnoringSafeArea(.all)
    }
}

struct ProfileView_Previews: PreviewProvider {
    static var previews: some View {
        ProfileView()
    }
}
