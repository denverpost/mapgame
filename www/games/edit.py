#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Remove a block of text and put another block of text in its place.
# Blocks of text, as of now, are demarcated as such:
# <!-- START #MAPGAME# -->
# text etc. do what you want the rhythm's gonna get you
# <!-- END #MAPGAME# -->
#
#sed -i "/<!-- START #$BLOCKNAME# -->/,/<!-- END #$BLOCKNAME# -->/d" 
# The text that's inserted comes from a file.
# The operation's performed on all unnamed arguments.
import os
import sys
import doctest
import csv
import argparse
import string
import re
import types

class Replace:
    """ Extended search and replace functionality tuned toward maintaining
        a bunch of flat files easily with the aid of marked blocks in the 
        flat files and include files to insert into them.
        """

    def __init__(self, filename, search, replace, verbose):
        """ Set the variables.
            """
        self.verbose = verbose
        self.filename = filename
        self.content = self.read_file(filename)
        self.search = search
        if os.path.isfile(replace):
            self.replace_content = self.read_file(replace)
        else:
            self.replace_content = replace

        content = self.replace()
        if content != '':
            self.write_file(content)
            #print content

    def replace(self):
        """
            """
        content, changes_made = re.subn(self.search, self.replace_content, self.content,
                                        re.MULTILINE|re.VERBOSE|re.IGNORECASE|re.DOTALL)
        if self.verbose:
            print changes_made
        return content


    def read_file(self, filename):
        """ Read a file, return its contents.
            """
        if filename == '':
            fn = open(self.filename, 'r')
        else:
            fn = open(filename, 'r')
        content = fn.read()
        fn.close
        return content

    def write_file(self, content):
        """ Write content to self.filename. Return True if nothing goes wrong.
            """
        fn = open(self.filename, 'w')
        try:
            # Only run this on non-unicode strings
            if type(content) is not types.UnicodeType:
                content = content.decode('utf-8', 'replace')
        except (UnicodeError), e:
            # Figure out what the position of the error is
            regex = re.compile('.* position ([0-9]*):')
            r = regex.search(e.__str__())
            if len(r.groups()) > 0:
                position = int(r.groups()[0])
                str_range = [position - 10, position + 10]
            print e, content[str_range[0]:str_range[1]]
        fn.write(content)
        fn.close
        return True

def main(args):
    """ 
        """
    for item in args.files[0]:
        obj = Replace(item, args.search, args.replace, args.verbose)

def build_parser(args):
    """ A method to handle argparse. We do it this way so it's testable.
        """
    parser = argparse.ArgumentParser(usage='$ python edit.py',
                                     description='''Edits a file, replacing a
                                                    regex with the contents of a file.''',
                                     epilog='')
    parser.add_argument("files", action="append", nargs="*")
    parser.add_argument("-r", "--replace", dest="replace", default='',
                        help="A string or a filepath to replace the regex pattern.")
    parser.add_argument("-s", "--search", dest="search", default='',
                        help="A regex to search for in the file.")
    parser.add_argument("-v", "--verbose", dest="verbose",
                        default=False, action="store_true")
    return parser.parse_args()

if __name__ == '__main__':
    args = build_parser(sys.argv)

    if args.verbose:
        doctest.testmod(verbose=args.verbose)

    main(args)
