//
//  ContentView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import SwiftUI

struct ContentView: View {
    @State private var selection = 0
    
    var body: some View {
        ZStack {
            if selection == 0 {
                CollectionsView()
            } else {
                ProfileView()
            }
            
            VStack {
                Spacer()
                BottomNavigationView(selection: $selection)
                    .fixedSize(horizontal: false, vertical: true)
                    .frame(maxWidth: .infinity)
                    .background(Color.white)
            }
        }
        .edgesIgnoringSafeArea(.all)
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
