//
//  LayoutView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import SwiftUI

struct LayoutView: View {
    @State var selection = 0
    
    var body: some View {
        VStack {
            if selection == 0 {
                CollectionsView()
            } else if selection == 1 {
                ProfileView()
            }
            
            BottomNavigationView(selection: $selection)
        }
        .edgesIgnoringSafeArea(.all)
    }
}

struct LayoutView_Previews: PreviewProvider {
    static var previews: some View {
        LayoutView()
    }
}
