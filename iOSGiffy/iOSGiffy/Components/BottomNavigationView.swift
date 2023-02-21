//
//  BottomNavigationView.swift
//  iOSGiffy
//
//  Created by Hachi on 2023-02-20.
//

import SwiftUI

struct BottomNavigationView: View {
    @Binding var selection: Int
    
    var body: some View {
        ZStack(alignment: .bottom) {
            HStack {
                Button(action: {
                    self.selection = 0
                }) {
                    VStack {
                        Image(systemName: "square.grid.2x2")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 20)
                        Text("Collections")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .foregroundColor(self.selection == 0 ? .white : .gray)
                    .background(self.selection == 0 ? Color("green100") : Color.clear)
                    .cornerRadius(15)
                }
                
                Button(action: {
                    self.selection = 1
                }) {
                    VStack {
                        Image(systemName: "person.crop.circle")
                            .resizable()
                            .aspectRatio(contentMode: .fit)
                            .frame(height: 20)
                        Text("Profile")
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .foregroundColor(self.selection == 1 ? .white : .gray)
                    .background(self.selection == 1 ? Color("green100") : Color.clear)
                    .cornerRadius(15)
                }
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(Color.white)
            .cornerRadius(25)
            .shadow(radius: 10)
            .padding(.horizontal, 30)
            .padding(.bottom, 30)
        }
    }
}

struct BottomNavigationView_Previews: PreviewProvider {
    static var previews: some View {
        BottomNavigationView(selection: Binding.constant(0))
    }
}
